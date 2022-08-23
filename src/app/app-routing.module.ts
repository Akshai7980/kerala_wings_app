/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_service/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'apply-leave',
    loadChildren: () => import('./apply-leave/apply-leave.module').then( m => m.ApplyLeavePageModule)
  },
  {
    path: 'terms-and-condition',
    loadChildren: () => import('./terms-and-condition/terms-and-condition.module').then( m => m.TermsAndConditionPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./_modal/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./_modal/logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'leave-history',
    loadChildren: () => import('./leave-history/leave-history.module').then( m => m.LeaveHistoryPageModule)
  },
  {
    path: 'trip-closing',
    loadChildren: () => import('./_modal/trip-closing/trip-closing.module').then( m => m.TripClosingPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'user-dashborad',
    loadChildren: () => import('./user-sections/user-dashborad/user-dashborad.module').then( m => m.UserDashboradPageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./user-sections/booking/booking.module').then( m => m.BookingPageModule)
  },
  {
    path: 'ongoing-trip',
    loadChildren: () => import('./user-sections/ongoing-trip/ongoing-trip.module').then( m => m.OngoingTripPageModule)
  },
  {
    path: 'trip-history',
    loadChildren: () => import('./user-sections/trip-history/trip-history.module').then( m => m.TripHistoryPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./user-sections/about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./user-sections/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'user-terms-and-condition',
    loadChildren: () => import('./user-sections/user-terms-and-condition/user-terms-and-condition.module').then( m => m.UserTermsAndConditionPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-sections/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./user-sections/user-settings/user-settings.module').then( m => m.UserSettingsPageModule)
  },
  {
    path: 'social-details',
    loadChildren: () => import('./_modal/social-details/social-details.module').then( m => m.SocialDetailsPageModule)
  },
  {
    path: 'user-login',
    loadChildren: () => import('./user-sections/user-login/user-login.module').then( m => m.UserLoginPageModule)
  },
  {
    path: 'user-registration',
    loadChildren: () => import('./user-sections/user-registration/user-registration.module').then( m => m.UserRegistrationPageModule)
  },
  {
    path: 'send-mail',
    loadChildren: () => import('./_modal/send-mail/send-mail.module').then( m => m.SendMailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
