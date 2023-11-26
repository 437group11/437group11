import { Editable, EditableInput, EditablePreview, IconButton, ButtonGroup, Text, Flex, HStack, Input } from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import React, {useState} from "react";

function EditableBio({ bio, onSave, onChange}) {
  const [editing, setEditing] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    onSave(); // Call the function to save the bio
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <Editable
          defaultValue={bio}
          value={bio}
          onChange={(value) => onChange(value)}
          isPreviewFocusable={false}
          >
          <EditablePreview />
          <Input as={EditableInput} />
          <ButtonGroup justifyContent='center' size='sm'>
            <IconButton icon={<CheckIcon />} onClick={handleSaveClick} aria-label={""} />
            <IconButton icon={<CloseIcon />} onClick={handleCancelClick} aria-label={""} />
          </ButtonGroup>
          </Editable>
      ) : (
        <>
        <HStack>
          <Text>{bio}</Text> 
          <IconButton size='sm' icon={<EditIcon />} onClick={handleEditClick} aria-label={""} />   
        </HStack>   
        </>
      )}
    </>
  );
}

export default EditableBio;