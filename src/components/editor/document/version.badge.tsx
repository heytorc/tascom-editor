import React from 'react'
import { Chip } from '@mui/material'

interface IVersionBadgeProps {
  status: 'canceled' | 'published' | 'building' | 'current';
}

type ColorTypes = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;

interface IVersionStatusColor {
  canceled: ColorTypes
  published: ColorTypes
  building: ColorTypes,
  current: ColorTypes,
}

export default function VersionBadge({ status }: IVersionBadgeProps) {
  const label = {
    canceled: 'Cancelado',
    published: 'Publicado',
    building: 'Construindo',
    current: 'Versão atual'
  };

  const handleColor = () => {
    const color: IVersionStatusColor = {
      canceled: 'error',
      published: 'success',
      building: 'warning',
      current: 'secondary',
    };

    return color[status] || undefined;
  };

  return (
    <Chip
      label={label[status]}
      color={handleColor()}
      size="small"
    />
  )
}
