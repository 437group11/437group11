// Adapted from https://github.com/knocklabs/react-notification-feed/blob/main/README.md#usage
import {
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
} from "@knocklabs/react-notification-feed"
import React, { useRef, useState } from "react"
import { Session } from "next-auth"

// Required CSS import, unless we override the styling
import "@knocklabs/react-notification-feed/dist/index.css"
import { Button } from "@chakra-ui/react"
import { BellIcon } from "@chakra-ui/icons"

export default function NotificationFeed({ session }: {session: Session}): JSX.Element {
    const [isVisible, setIsVisible] = useState(false)
    const notifButtonRef = useRef(null)

    return (
        <KnockFeedProvider
            apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_KEY!}
            userId={session.user.id}
            feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!}
            colorMode={"dark"}
        >
            <>
                <Button aria-label="Show notifications feed">
                    <NotificationIconButton onClick={(e) => setIsVisible(!isVisible)} ref={notifButtonRef} />
                </Button>

                <NotificationFeedPopover
                    buttonRef={notifButtonRef}
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                />
            </>
        </KnockFeedProvider>
    )
}