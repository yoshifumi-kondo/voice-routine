import { Injectable } from "@nestjs/common";
import { UserId, UserDomain, UserProps, UserRepository } from "src/domain";
import * as admin from "firebase-admin";

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findById(id: UserId): Promise<UserDomain | null> {
    const props = await this.userRepository.findById(id);
    return props ? new UserDomain(props) : null;
  }

  async getUserPhoneNumber(id: UserId): Promise<string> {
    try {
      const userRecord = await admin.auth().getUser(id);
      if (!userRecord.phoneNumber) {
        throw new Error(`Phone number is not available for user ${id}`);
      }
      return userRecord.phoneNumber;
    } catch (error) {
      throw new Error(`Failed to get phone number: ${error.message}`);
    }
  }

  async save(userProps: UserProps): Promise<void> {
    const existing = await this.findById(userProps.id);
    if (existing) {
      throw new Error("User already exists");
    }
    await this.userRepository.save(userProps);
  }

  async delete(id: UserId): Promise<void> {
    await admin.auth().deleteUser(id);
    await this.userRepository.delete(id);
  }
}
