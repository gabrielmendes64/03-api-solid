import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../../../app";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";



describe("Create Check-in (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});
	
	afterAll(async () => {
		await app.close();
	});

	it("shoud be able to create a check-in",async () => {

		const {token} = await createAndAuthenticateUser(app, true);
 
		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: "Js Gym",
				latitude: -4.3750223,
				longitude: -38.8064687
			}}
		);

		let checkIn = await prisma.checkIn.create({
			data: {
				gym_id: gym.id,
				user_id: user.id,
			}
		});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toEqual(204);

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id,
			}
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		
	});
});

