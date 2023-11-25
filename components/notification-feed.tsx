// Adapted from https://github.com/knocklabs/react-notification-feed/blob/main/README.md#usage
import {
    KnockFeedProvider,
    NotificationIconButton,
    NotificationFeedPopover,
} from "@knocklabs/react-notification-feed"
import React, { useRef, useState } from "react"
import { Session } from "next-auth"

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css"
import { IconButton } from "@chakra-ui/react"
import { BellIcon } from "@chakra-ui/icons"

export default function NotificationFeed({ session }: {session: Session}): JSX.Element {
    const [isVisible, setIsVisible] = useState(false)
    const notifButtonRef = useRef(null)

    return (
        <KnockFeedProvider apiKey={process.env.KNOCK_PUBLIC_KEY!} userId={session.user.id} feedId={process.env.KNOCK_FEED_CHANNEL_ID!}>
            <>
                <IconButton
                    ref={notifButtonRef}
                    icon={<BellIcon />}
                    aria-label="Show notifications feed"
                    onClick={(e) => setIsVisible(!isVisible)}
                />
                <NotificationFeedPopover
                    buttonRef={notifButtonRef}
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                />
            </>
        </KnockFeedProvider>
    )
}