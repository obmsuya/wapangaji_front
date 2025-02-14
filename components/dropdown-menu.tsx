import { View, Text } from 'react-native'
import React from 'react'
import { EllipsisVertical, Trash, Pencil } from "lucide-react-native";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

const TenantDropdownMenu = ({ onEdit, onDelete }: Props) => {
  return (
    <View>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={20} color="#000" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='gap-2 p-2'>
          <DropdownMenuItem onPress={onEdit}>
            <Pencil size={16} color="#000" />
            <Text>Edit</Text>
          </DropdownMenuItem>
          <DropdownMenuItem onPress={onDelete}>
            <Trash size={20} color="#e63946" />
            <Text className="text-destructive">Delete</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}

export default TenantDropdownMenu;