import { IUserRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
    userId: string;
}

interface GetUserProfileUseCaseResponse{
    user: User;
}

export class GetUserProfileUseCase{
	constructor(private userRepositoy : IUserRepository) {}

	async execute({
		userId,
	}: GetUserProfileUseCaseRequest) : Promise <GetUserProfileUseCaseResponse>{
		const user = await this.userRepositoy.findById(userId);

		if(!user){
			throw new ResourceNotFoundError();
		}

		return{
			user,
		};
	}


}