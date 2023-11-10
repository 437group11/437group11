import React, { useState, useEffect } from "react"
import { Avatar, Image, Skeleton } from "@chakra-ui/react"

interface ProfilePictureProps {
    userId: string
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ userId }) => {
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
        null
    )

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await fetch(`/api/v2/users/${userId}`)
                const data = await response.json()

                if (
                    data.status === "success" &&
                    data.data &&
                    data.data.user &&
                    data.data.user.image
                ) {
                    setProfilePictureUrl(data.data.user.image)
                } else {
                    console.error("Error fetching profile picture data:", data)
                }
            } catch (error) {
                console.error("Error fetching profile picture:", error)
            }
        }

        fetchProfilePicture()
    }, [userId])

    return (
        <Skeleton isLoaded={profilePictureUrl !== null}>
            <Avatar src={profilePictureUrl ?? undefined}/>
        </Skeleton>
    )
}

export default ProfilePicture
