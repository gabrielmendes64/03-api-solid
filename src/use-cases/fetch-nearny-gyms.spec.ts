import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { FeatchNearbyGymsUseCase } from "./fetch-nearby-gyms";


let gymsRepository : InMemoryGymRepository;
let sut : FeatchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {

	beforeEach(() => {		
		gymsRepository = new InMemoryGymRepository();
		sut = new FeatchNearbyGymsUseCase(gymsRepository);
	});

	it("should be able to fetch nearby gyms",async () => {
	
		await gymsRepository.create({
			title: "Near Gym",
			description: null,
			phone: null, 			
			latitude: -4.3298377,
			longitude: -38.8807741
		});

        
		await gymsRepository.create({
			title: "Far Gym",
			description: null,
			phone: null, 			
			latitude: -4.9694664,
			longitude: -39.0162098
		});

		const { gyms } = await sut.execute({
			userLatitude: -4.3298377,
			userLongitude: -38.8807741
		});

		expect(gyms).length(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title : "Near Gym"}),
		]);
	}); 


});