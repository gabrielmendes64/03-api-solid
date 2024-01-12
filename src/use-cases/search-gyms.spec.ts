import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { SearchGymsUseCase } from "./search-gyms";


let gymsRepository : InMemoryGymRepository;
let sut : SearchGymsUseCase;

describe("Search Gyms Use Case", () => {

	beforeEach(() => {		
		gymsRepository = new InMemoryGymRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it("should be able to search for gyms",async () => {
	
		await gymsRepository.create({
			title: "Academia do js",
			description: null,
			phone: null, 			
			latitude: -4.3750223,
			longitude: -38.8064687
		});

        
		await gymsRepository.create({
			title: "Academia do ts",
			description: null,
			phone: null, 			
			latitude: -4.3750223,
			longitude: -38.8064687
		});

		const { gyms } = await sut.execute({
			query: "Academia do ts",
			page: 1,
		});

		expect(gyms).length(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title : "Academia do ts"}),
		]);
	}); 

	it("should be able to fetch paginated gym search",async () => {

		for(let i = 1; i <= 22; i++){
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				description: null,
				phone: null, 			
				latitude: -4.3750223,
				longitude: -38.8064687
			});
		}

		const { gyms } = await sut.execute({
			query: "JavaScript",
			page: 2,
		});

		expect(gyms).length(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title : "JavaScript Gym 21"}),
			expect.objectContaining({ title : "JavaScript Gym 22"}),
		]);
	}); 

});