export enum SuccessMessage {
  /* Module: Authentication */
  sign_up_success = "Registration was successful, an email with account activation was sent to the email you specified.",

  /* Module: User */
  update_password = "Your password has been updated successfully.",
}

export enum ErrorMessage {
  /* Module: Authentication */
  user_exists = "User with this email already exists.",
  invitation_not_found = "Invitation can not be found or has expired",
  user_not_exists = "That credentials is either invalid, not a verified primary email or is not associated with a personal user account.",
  profile_not_found = "User profile not found.",
  incorrect_credentials = "Incorrect email or password, please try again.",
  unable_to_login = "Your can not sign in right now",
  invalid_access_token = "Invalid token, please try sign in.",
  cant_send_email = "Could not send an email on the specified address",

  /* Module: User */
  update_password = "Incorrect current password or a new password doesn't match with confirm password.",
}
