
import { randomUUID } from "node:crypto";
import "dotenv/config" ;
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


function generateDatabaseURL(schema: string){
	if(!process.env.DATABASE_URL){
		throw new Error("Please provide a database url environment variable");
	}

	const url = new URL(process.env.DATABASE_URL);

	url.searchParams.set("schema", schema);

	return url.toString();
}

export class Environment{
	schema: string;

	constructor() {
		this.schema = "";
	}

	async setup() {

		this.schema = randomUUID();
		const databaseURL = generateDatabaseURL(this.schema);

		process.env.DATABASE_URL = databaseURL;

		execSync("npx prisma migrate deploy");

	}

	async teardown(){
		await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);

		await prisma.$disconnect();
	}
}