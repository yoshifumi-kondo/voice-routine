import { Injectable } from "@nestjs/common";
import {
  CallDomain,
  CallId,
  CallRepository,
  CallStatus,
  UserId,
} from "../domain";

@Injectable()
export class CallsService {
  constructor(private callRepository: CallRepository) {}

  async findById(id: CallId): Promise<CallDomain | null> {
    const props = await this.callRepository.findById(id);
    return props ? new CallDomain(props) : null;
  }

  async save(call: CallDomain): Promise<void> {
    await this.callRepository.save(call.toObject());
  }

  async totalCalls(userId: UserId): Promise<number> {
    return await this.callRepository.totalCalls(userId);
  }

  async findByUserId(userId: UserId): Promise<CallDomain[]> {
    const list = await this.callRepository.findByUserId(userId);
    return list.map((props) => new CallDomain(props));
  }

  async findOngoingByUserId(userId: UserId): Promise<CallDomain[]> {
    const list = await this.callRepository.findOngoingByUserId(userId);
    return list.map((props) => new CallDomain(props));
  }

  async updateCallState(
    callSid: CallId,
    callStatus: CallStatus
  ): Promise<void> {
    
    const callDomain = await this.findById(callSid);
    if (callDomain?.isOngoing()) {
      try {
        
        const updatedCall = callDomain.updateStatus(callStatus, new Date());
        await this.save(updatedCall);
        console.log("Call state updated and saved for status:", callStatus);
      } catch (error) {
        console.error("Failed to update call state:", error);
      }
    }
  }
}
