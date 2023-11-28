import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { Children } from "react";

export default function HamburgerMenu({ children }: { children: React.ReactNode }) {
    return (
        <Menu>
            <MenuButton as={IconButton} icon={<HamburgerIcon />} />
            <MenuList>
                {React.Children.map(children, (child, index) => (
                    <MenuItem key={index}>{child}</MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
