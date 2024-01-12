import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import {InMemoryUserRepository} from "../repositories/in-memory/in-memory-user-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let userRepository : InMemoryUserRepository;
let sut : GetUserProfileUseCase;


describe("Get User Profile Use Case", () => {

	beforeEach(() => {
		userRepository = new InMemoryUserRepository();
		sut = new GetUserProfileUseCase(userRepository);

	});

	it("should be able to get user profile", async () => {
	
		const userCreate = await userRepository.create({
			name: "fulano",
			email: "fulano@gmail.com",
			password_hash: await hash("123456", 6)
		});

		const { user } = await sut.execute({
			userId: userCreate.id,
		});


		expect(user.name).toEqual("fulano");
	}); 

	it("should not be able to authenticate with wrong id",async () => {

		await expect(() => 
			sut.execute({
				userId: "non-existing-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);

	});

	
});