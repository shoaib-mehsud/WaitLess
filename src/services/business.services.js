import { da } from "zod/v4/locales";
import { prisma } from "../config/db.js";


export async function createBusiness(data) {
    const {name,ownerId,} = data
    const checkBusinessExist = await prisma.business.findFirst({
        where: {    name      }
    });

    if(checkBusinessExist){
        throw new Error("Business already exist with same name")
    }

    const newBusiness = await prisma.business.create({
        data: {
            name,
            ownerId
        },
        select: {
            id: true,
            name: true,
        }
    });

    return newBusiness;

}

export async function getBusiness(data){
    const id = data
    const businessDetail = await prisma.business.findFirst({
       where:{ id } ,
       select: {
        name: true,
        createdAT: true,
        owner: {
            select:{name:true}
        }
       }
    });
    return businessDetail;

}