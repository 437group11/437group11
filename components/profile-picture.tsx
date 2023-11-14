import React from "react"
import { Avatar, AvatarProps, ResponsiveValue, ThemingProps } from "@chakra-ui/react"
import { Prisma } from "@prisma/client"
import Link from "next/link"
import { User } from "next-auth"

interface ProfilePictureProps extends AvatarProps {
    user: User
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, ...avatarProps }) => {
    return (
        <Link href={`/profile/${user.id}`}>
            <Avatar src={user.image ?? undefined} name={user.name || undefined} {...avatarProps}/>
        </Link>
    )
}

export default ProfilePicture
