import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";

function EditableControls ({onSave} : {onSave: Function}) {
  const [editing, setEditing] = useState(false);

  const handleSaveClick = () => {
      onSave(); // Call the function to save the bio
      setEditing(false);
  };

  const handleEditClick = () => {
      setEditing(true);
  };

  const handleCancelClick = () => {
      setEditing(false);
  };

  return editing ? (
  <ButtonGroup size='sm' p={5}>
      <IconButton icon={<CheckIcon />} onClick={handleSaveClick} aria-label={""}/>
      <IconButton icon={<CloseIcon />} onClick={handleSaveClick} aria-label={""}/>
  </ButtonGroup>
  ) : (
  <Flex>
      <IconButton aria-label={""} size='sm' icon={<EditIcon />} onClick={handleEditClick} />
  </Flex>
  )
}

export default EditableControls;