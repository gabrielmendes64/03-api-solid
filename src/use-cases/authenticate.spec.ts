import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import {InMemoryUserRepository} from "../repositories/in-memory/in-memory-user-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let userRepository : InMemoryUserRepository;
let sut : AuthenticateUseCase;


describe("Authenticate Use Case", () => {

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new AuthenticateUseCase(userRepository);

	});

	it("should be able to authenticate",async () => {
	
		await userRepository.create({
			name: "fulano",
			email: "fulano@gmail.com",
			password_hash: await hash("123456", 6)
		});

		const { user } = await sut.execute({
			email: "fulano@gmail.com",
			password: "123456"
		});


		expect(user.id).toEqual(expect.any(String));
	}); 

	it("should not be able to authenticate with wrong email",async () => {

		await expect(() => 
			sut.execute({
				email: "fulano@gmail.com",
				password: "123456"
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);

	});

	it("should not be able to authenticate with wrong passoword",async () => {
		await userRepository.create({
			name: "fulano",
			email: "fulano@gmail.com",
			password_hash: await hash("123456", 6)
		});

		await expect(() => 
			sut.execute({
				email: "fulano@gmail.com",
				password: "123123"
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);

	});

});