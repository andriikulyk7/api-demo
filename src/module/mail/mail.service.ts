import { ConfigService } from "@nestjs/config";
import * as mailchimp from "@mailchimp/mailchimp_transactional";
import { Injectable } from "@nestjs/common";
import { IMailerOptions } from "../../common/interface/mail.interface";
import {
  MailSubjectsEnum,
  MailTemplatesEnum,
  MailVariablesEnum,
} from "../../common/enum/mail.enum";

@Injectable()
export class MailService {
  private readonly mailer;
  private readonly defaultSender: string;
  private readonly webAppUrl: string;

  constructor(private readonly configService: ConfigService) {
    const key = configService.get("mailchimp.key");
    const defaultSender = this.configService.get("mailchimp.sender_email");
    const webAppUrl = this.configService.get("app.web_url");

    this.mailer = mailchimp(key);
    this.defaultSender = defaultSender;
    this.webAppUrl = webAppUrl;
  }

  public async ping() {
    return await this.mailer.users.ping();
  }

  public async sendClientAdminEvaluatioMail(
    email: string,
    firstName: string,
    approved: boolean
  ) {
    return true;
    const template = approved
      ? MailTemplatesEnum.CLIENT_ADMIN_APPROVED
      : MailTemplatesEnum.CLIENT_ADMIN_REJECTED;
    const subject = approved
      ? MailSubjectsEnum.CLIENT_ADMIN_APPROVED
      : MailSubjectsEnum.CLIENT_ADMIN_REJECTED;

    await this.send({
      subject: subject,
      template: template,
      receiverEmail: email,
      vars: [{ name: MailVariablesEnum.USERNAME, content: firstName }],
    });
  }

  public async sendPasswordResetMail(
    email: string,
    firstName: string,
    token: string
  ) {
    const resetPageUrl = `${this.webAppUrl}/set-password/?token=${token}`;

    await this.send({
      subject: MailSubjectsEnum.PASSWORD_RESET,
      template: MailTemplatesEnum.PASSWORD_RESET,
      receiverEmail: email,
      vars: [
        { name: MailVariablesEnum.PASSWORD_RESET_PAGE, content: resetPageUrl },
        { name: MailVariablesEnum.USERNAME, content: firstName },
      ],
    });
  }

  public async sendClientAdminInvitation(email: string, token: string) {
    return true;
    const resetPageUrl = `${this.webAppUrl}/client-admin-invitation/${token}`;

    await this.send({
      subject: MailSubjectsEnum.CLIENT_ADMIN_INVITATION,
      template: MailTemplatesEnum.CLIENT_ADMIN_INVITATION,
      receiverEmail: email,
      vars: [
        {
          name: MailVariablesEnum.CLIENT_ADMIN_INVITATION_PAGE,
          content: resetPageUrl,
        },
      ],
    });
  }

  private async send(options: IMailerOptions) {
    const { template, subject, receiverEmail, senderEmail, vars } = options;

    const from = senderEmail ?? this.defaultSender;

    return await this.mailer.messages.sendTemplate({
      template_name: template,
      template_content: [{}],
      message: {
        subject: subject,
        from_email: from,
        to: [{ email: receiverEmail, type: "to" }],
        inline_css: true,
        merge_language: "handlebars",
        global_merge_vars: vars,
      },
    });
  }
}
