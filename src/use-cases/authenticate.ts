import { IUserRepository } from "@/repositories/user-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUseCaseResponse{
    user: User
}

export class AuthenticateUseCase{
	constructor(private userRepositoy : IUserRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest) : Promise <AuthenticateUseCaseResponse>{
		const user = await this.userRepositoy.findByEmail(email);

		if(!user){
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await compare(password, user.password_hash);

		if(!doesPasswordMatches){
			throw new InvalidCredentialsError();
		}

		return{
			user,
		};
	}


}