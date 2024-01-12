import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { CreateGymUseCase } from "./create-gym";


let gymRepository : InMemoryGymRepository;
let sut : CreateGymUseCase;

describe("Create gym use case", () => {

	beforeEach(() => {		
		gymRepository = new InMemoryGymRepository();
		sut = new CreateGymUseCase(gymRepository);
	});

	it("should be able to create gym",async () => {
	
		const { gym } = await sut.execute({
			title: "Academia do js",
			description: null,
			phone: null, 			
			latitude: -4.3750223,
			longitude: -38.8064687
		});


		expect(gym.id).toEqual(expect.any(String));
	}); 

});