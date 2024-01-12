import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import {InMemoryUserRepository} from "../repositories/in-memory/in-memory-user-repository";
import { UserAlredyExistsError } from "./errors/user-alredy-exists-error";


let userRepository : InMemoryUserRepository;
let sut : RegisterUseCase;

describe("Register Use Case", () => {

	beforeEach(() => {		
		userRepository = new InMemoryUserRepository();
		sut = new RegisterUseCase(userRepository);
	});

	it("should be able to register",async () => {
	
		const { user } = await sut.execute({
			name: "fulano",
			email: "fulano@gmail.com",
			password: "123456"
		});


		expect(user.id).toEqual(expect.any(String));
	}); 

	it("should hash user passoword upon registration",async () => {
	
		const { user } = await sut.execute({
			name: "fulano",
			email: "fulano@gmail.com",
			password: "123456"
		});

		const idPasswordCorrectlyHashed = await compare(
			"123456",
			user.password_hash,
		);

		expect(idPasswordCorrectlyHashed).toBe(true);
	}); 

	it("should not be able to register with same e-mail",async () => {

		const email = "fulano@gmail.com";
	
		await sut.execute({
			name: "fulano",
			email,
			password: "123456"
		});

		await expect(() => 
			sut.execute({
				name: "fulano",
				email,
				password: "123456"
			}),

		).rejects.toBeInstanceOf(UserAlredyExistsError);
	}); 
});