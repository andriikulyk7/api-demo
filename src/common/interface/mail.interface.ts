import {
  MailSubjectsEnum,
  MailTemplatesEnum,
  MailVariablesEnum,
} from "../enum/mail.enum";

export interface IMailerOptions {
  template: MailTemplatesEnum;
  subject: MailSubjectsEnum;
  receiverEmail: string;
  vars: { name: MailVariablesEnum; content: string }[];

  senderEmail?: string;
}
