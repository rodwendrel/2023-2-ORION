import connect from "@/lib/mongodb";
import Comment from "@/models/Comments";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";


//deletando um evento
export async function DELETE(req: NextRequest, { params}: {params :{ slug: number}}) {
    const { id_comment, user} = await req.json();
    const slug = params.slug
    const _id = { "_id": slug}
    await connect();

    const eventExist = await Event.findOne({_id});

    if(!eventExist){
        return new NextResponse("Evento não existe", {status: 400}) //retorna erro caso o evento não exista
    }

    const commentExist = await Comment.findOne({id_comment})

    if(!commentExist){
        return new NextResponse("Comentário não existe", {status: 400}) //retorna erro caso o comentario não exista
    }

    const ownComment = await Comment.findOne({id_comment, user})

    if(!ownComment){
        return new NextResponse("Comentário não é seu", {status: 400}) //retorna erro caso o comentario não seja seu
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(id_comment);

        return new NextResponse(JSON.stringify({
            message: "Event created successfully",
            DeletedEvent: deletedComment,
            success: true,
        }), {status: 201})
    } catch(error: any) {
        return new NextResponse(error, {status: 500})
    }
}