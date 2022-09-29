import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { EntityManager } from "typeorm/entity-manager/EntityManager";

@Injectable()
export class DBService {
  constructor(private readonly dbConnection: Connection) {}

  public get connection(): Connection {
    return this.dbConnection;
  }

  public async transaction<T>(
    callback: (entityManager: EntityManager) => Promise<T>
  ): Promise<T> {
    return await this.connection.transaction(callback);
  }
}
