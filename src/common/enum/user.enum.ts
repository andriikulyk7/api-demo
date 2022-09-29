export enum UserRole {
  admin = "admin",
  client_admin = "client_admin",
}

export enum RequestStatusEnum {
  pending = "pending",
  accept = "accept",
  reject = "reject",
}

export enum RequestActionEnum {
  accept = "accept",
  reject = "reject",
}

export enum UserStatus {
  active = "active",
  pending = "pending",
  invited = "invited",
  rejected = "rejected",
  archived = "archived",
  banned = "banned",
}

export enum ExperienceEnum {
  elementary = "elementary",
  beginner = "beginner",
  junior = "junior",
  middle = "middle",
  senior = "senior",
}

export enum ExperienceLabelEnum {
  elementary = "0-6 month",
  beginner = "6-12 month",
  junior = "1-3 years",
  middle = "3-5 years",
  senior = "more than 5 years",
}
