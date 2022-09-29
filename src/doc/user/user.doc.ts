export class UserDoc {
  static get profile() {
    return {
      type: "object",
      example: {
        workExperience: [
          {
            experience: "string",
            description: "string",
          },
        ],
        timezone: "string",
        contactEmail: "string",
        phone: "string",
        firstName: "string",
        lastName: "string",
        state: "string",
        city: "string",
        bio: "string",
        avatar: "string",
      },
    };
  }

  static get requests() {
    return {
      type: "object",
      example: {
        found: "number",
        requests: [
          {
            id: "string",
            status: "string",
            industry: [
              {
                value: "string",
                label: "string",
              },
            ],
            profile: {
              id: "string",
              role: "string",
              email: "string",
              firstName: "string",
              lastName: "string",
              state: "string",
              city: "string",
              gender: "string",
              race: "string",
              bio: "string",
              avatar: "string",
            },
            projectId: "string",
          },
        ],
      },
    };
  }

  static get request() {
    return {
      type: "object",
      example: {
        id: "string",
        status: "string",
        industry: [
          {
            value: "string",
            label: "string",
          },
        ],
        profile: {
          id: "string",
          role: "string",
          email: "string",
          firstName: "string",
          lastName: "string",
          state: "string",
          city: "string",
          gender: "string",
          race: "string",
          bio: "string",
          avatar: "string",
        },
        projectId: "string",
      },
    };
  }

  static get secure() {
    return {
      type: "object",
      example: {
        message: "string",
      },
    };
  }

  static get dashboard() {
    return {
      type: "object",
      example: {
        analitics: {
          grows: {
            "2021": {
              Jan: {
                new: "number",
                existing: "number",
              },
              Feb: {
                new: "number",
                existing: "number",
              },
              Mar: {
                new: "number",
                existing: "number",
              },
              Apr: {
                new: "number",
                existing: "number",
              },
              May: {
                new: "number",
                existing: "number",
              },
              Jun: {
                new: "number",
                existing: "number",
              },
              Jul: {
                new: "number",
                existing: "number",
              },
              Aug: {
                new: "number",
                existing: "number",
              },
              Sep: {
                new: "number",
                existing: "number",
              },
              Oct: {
                new: "number",
                existing: "number",
              },
              Nov: {
                new: "number",
                existing: "number",
              },
              Dec: {
                new: "number",
                existing: "number",
              },
            },
          },
        },
      },
    };
  }
}
