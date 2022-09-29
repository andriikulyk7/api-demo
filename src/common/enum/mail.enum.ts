export enum MailTemplatesEnum {
  PASSWORD_RESET = "password-reset",
  CLIENT_ADMIN_REJECTED = "CLIENT_ADMIN_REJECTED",
  CLIENT_ADMIN_APPROVED = "CLIENT_ADMIN_APPROVED",
  CLIENT_ADMIN_INVITATION = "client-admin-invitation",
}

export enum MailSubjectsEnum {
  PASSWORD_RESET = "password reset",
  CLIENT_ADMIN_REJECTED = "CLIENT_ADMIN_REJECTED",
  CLIENT_ADMIN_APPROVED = "CLIENT_ADMIN_APPROVED",
  CLIENT_ADMIN_INVITATION = "invitation to become a client admin",
}

export enum MailVariablesEnum {
  USERNAME = "username",
  PASSWORD_RESET_PAGE = "reset_page",
  CLIENT_ADMIN_INVITATION_PAGE = "client-admin-invitation-page",
}
