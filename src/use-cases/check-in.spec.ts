import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "../repositories/in-memory/in-memory-check-in-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymRepository } from "../repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-distance-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";


let checkInRepository : InMemoryCheckInRepository;
let gymRepository : InMemoryGymRepository;
let sut : CheckInUseCase;

describe("Check in Use Case", () => {

	beforeEach(async () => {		
		checkInRepository = new InMemoryCheckInRepository();
		gymRepository = new InMemoryGymRepository();
		sut = new CheckInUseCase(checkInRepository, gymRepository);

		await gymRepository.create({
			id: "gym-01",
			title: "Js Academia",
			description: "",
			phone: "",
			latitude: -4.3340327,
			longitude: -38.891578,
		});	

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in",async () => {
	
		const { checkIn } = await sut.execute({
			userId: "user-01",
			gymId: "gym-01",
			userLatitude: -4.3340327,
			userLongitude: -38.891578,
		});


		expect(checkIn.id).toEqual(expect.any(String));
	}); 

	it("should not be able to check in twice in the same day",async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: "user-01",
			gymId: "gym-01",
			userLatitude: -4.3340327,
			userLongitude: -38.891578,
		});

		await expect(() => 
			sut.execute({
				userId: "user-01",
				gymId: "gym-01",
				userLatitude: -4.3340327,
				userLongitude: -38.891578,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	}); 

	it("should be able to check in twice but in different day",async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			userId: "user-01",
			gymId: "gym-01",	
			userLatitude: -4.3340327,
			userLongitude: -38.891578,
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			userId: "user-01",
			gymId: "gym-01",
			userLatitude: -4.3340327,
			userLongitude: -38.891578,
		});

		expect(checkIn.id).toEqual(expect.any(String));
		
	});

	it("should not be able to check in on distant gym",async () => {
		gymRepository.items.push({
			id: "gym-02",
			title: "Js Academia",
			description: "",
			phone: "",
			latitude: new Decimal(-4.3750223),
			longitude: new Decimal(-38.8064687)
		});
	
		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -27.2092052,
				userLongitude: -49.6401091,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);

	}); 
});