<?php

namespace App\Services;

use App\Models\Booking;
use BigBlueButton\BigBlueButton;
use BigBlueButton\Parameters\CreateMeetingParameters;
use BigBlueButton\Parameters\GetMeetingInfoParameters;
use BigBlueButton\Parameters\JoinMeetingParameters;
use Illuminate\Support\Str;

class BigBlueButtonService
{
    protected BigBlueButton $bbb;

    public function __construct()
    {
        $serverUrl = config('bigbluebutton.server_base_url');
        $secretSalt = config('bigbluebutton.security_salt');

        if (config('app.env') === 'testing' && empty($serverUrl)) {
            $serverUrl = 'http://test.example.com/bigbluebutton/';
            $secretSalt = 'test-salt';
        }

        if (empty($serverUrl)) {
            throw new \RuntimeException("BigBlueButton Server URL is not configured. Please add 'BBB_SERVER_BASE_URL' to your .env file.");
        }

        $this->bbb = new BigBlueButton($serverUrl, $secretSalt);
    }

    public function getJoinUrl(Booking $booking, string $userName, bool $isModerator): string
    {
        if (! $booking->bbb_meeting_id || ! $this->isMeetingRunning($booking->bbb_meeting_id)) {
            $this->createMeeting($booking);
        }

        $password = $isModerator ? $booking->bbb_moderator_password : $booking->bbb_attendee_password;
        $joinParams = new JoinMeetingParameters($booking->bbb_meeting_id, $userName, $password);
        $joinParams->setRedirect(true);

        return $this->bbb->getJoinMeetingURL($joinParams);
    }

    protected function isMeetingRunning(string $meetingId): bool
    {
        $response = $this->bbb->getMeetingInfo(new GetMeetingInfoParameters($meetingId));

        return $response->getReturnCode() === 'SUCCESS';
    }

    protected function createMeeting(Booking $booking): void
    {
        $meetingId = (string) Str::uuid();
        $attendeePw = Str::random(10);
        $moderatorPw = Str::random(10);

        $meetingName = $booking->name ?? 'Session with '.$booking->tutor->user->name;
        $createParams = new CreateMeetingParameters($meetingId, $meetingName);
        $createParams->setAttendeePassword($attendeePw);
        $createParams->setModeratorPassword($moderatorPw);

        $duration = max(0, now()->diffInMinutes($booking->end));
        $createParams->setDuration($duration);

        $response = $this->bbb->createMeeting($createParams);

        if ($response->getReturnCode() === 'SUCCESS') {
            $booking->update([
                'bbb_meeting_id' => $meetingId,
                'bbb_attendee_password' => $attendeePw,
                'bbb_moderator_password' => $moderatorPw,
            ]);
        } else {
            throw new \Exception('Failed to create BigBlueButton meeting: '.$response->getMessage());
        }
    }
}
