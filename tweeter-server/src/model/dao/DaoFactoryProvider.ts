import { DaoFactory } from "./DaoFactory";
import { DynamoDaoFactory } from "./dynamo/DynamoDaoFactory";

export class DaoFactoryProvider {
  private static instance: DaoFactory = new DynamoDaoFactory();

  static getFactory(): DaoFactory {
    return DaoFactoryProvider.instance;
  }

  // note: for tests, swap in a mock factory
  static setFactory(factory: DaoFactory): void {
    DaoFactoryProvider.instance = factory;
  }
}
