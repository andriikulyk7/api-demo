import { MigrationInterface, QueryRunner } from "typeorm";
import { UserEntity } from "@entity";
import { UserRole, UserStatus } from "@enum";

export class User1639737360243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createUsers(this.usersSchema, queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Do nothing
  }

  private async createUsers(
    usersSchema,
    queryRunner: QueryRunner
  ): Promise<void> {
    const userRepository = await queryRunner.connection.getRepository(
      UserEntity
    );

    await Promise.all(
      usersSchema.map(async (schema) => {
        const { user } = schema;

        const userEntity = UserEntity.create({
          ...user,
          completeOnboarding: true,
          status: UserStatus.active,
        });

        return await userRepository.save(userEntity);
      })
    );
  }

  private get usersSchema() {
    const password = "helloWorld123";

    return [
      {
        user: {
          role: UserRole.admin,
          email: "admin@gmail.com",
          password,
        },
        profile: {
          firstName: "Winston",
          lastName: "Churchill",
          state: "Oxfordshire",
          city: "Blenheim",
          gender: "Male",
          race: "Varietas Caucasia",
          bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
          avatar:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Sir_Winston_Churchill_-_19086236948.jpg/500px-Sir_Winston_Churchill_-_19086236948.jpg",
        },
      },
    ];
  }
}
