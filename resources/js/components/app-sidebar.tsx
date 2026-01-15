import { edit as profileDetails } from '@/actions/App/Http/Controllers/ProfileDetailsController';
import { index as tutorBookings } from '@/actions/App/Http/Controllers/Tutor/BookingController';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard as studentDashboard } from '@/routes/student';
import { index as findTutors } from '@/routes/student/tutors';
import { dashboard as tutorDashboard } from '@/routes/tutor';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Search, UserCircle } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    const dashboardUrl =
        auth.user.role === 'tutor' ? tutorDashboard() : studentDashboard();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
    ];

    if (auth.user.role === 'student') {
        mainNavItems.push({
            title: 'Find a Tutor',
            href: findTutors(),
            icon: Search,
        });
    }

    if (auth.user.role === 'tutor') {
        mainNavItems.push({
            title: 'Tutor Bookings',
            href: tutorBookings(),
            icon: BookOpen,
        });

        mainNavItems.push({
            title: 'Profile Details',
            href: profileDetails(),
            icon: UserCircle,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
