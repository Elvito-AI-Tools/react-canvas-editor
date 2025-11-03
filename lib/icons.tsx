import { 
  FaHeart, FaStar, FaHome, FaUser, FaCog, FaEnvelope, FaPhone, FaCamera,
  FaMusic, FaVideo, FaFile, FaFolder, FaTrash, FaEdit, FaSave, FaDownload,
  FaUpload, FaSearch, FaBell, FaCalendar, FaClock, FaMapMarkerAlt, FaGlobe,
  FaShoppingCart, FaCreditCard, FaGift, FaTag, FaBookmark, FaLock, FaUnlock,
  FaEye, FaEyeSlash, FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaLink,
  FaPaperclip, FaImage, FaPlay, FaPause, FaStop, FaForward, FaBackward
} from 'react-icons/fa'
import { 
  AiFillApple, AiFillAndroid, AiFillWindows, AiFillChrome, AiFillFire,
  AiFillBulb, AiFillCloud, AiFillCrown, AiFillTrophy, AiFillRocket,
  AiFillThunderbolt, AiFillShop, AiFillCar,
} from 'react-icons/ai'
import { 
  BiSolidPlanet, BiSolidMoon, BiSolidSun, BiSolidCoffee, BiSolidPizza,
  BiSolidTree, BiSolidDog, BiSolidCat,
} from 'react-icons/bi'
import {
  BsFillLightningChargeFill, BsFillMoonStarsFill, BsFillSunFill, BsFillCloudFill,
} from 'react-icons/bs'
import { IconType } from 'react-icons'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export const ICON_COMPONENTS: Record<string, IconType> = {
  FaHeart,
  FaStar,
  FaHome,
  FaUser,
  FaCog,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaMusic,
  FaVideo,
  FaFile,
  FaFolder,
  FaTrash,
  FaEdit,
  FaSave,
  FaDownload,
  FaUpload,
  FaSearch,
  FaBell,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaGlobe,
  FaShoppingCart,
  FaCreditCard,
  FaGift,
  FaTag,
  FaBookmark,
  FaLock,
  FaUnlock,
  FaEye,
  FaEyeSlash,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaLink,
  FaPaperclip,
  FaImage,
  FaPlay,
  FaPause,
  FaStop,
  FaForward,
  FaBackward,
  AiFillApple,
  AiFillAndroid,
  AiFillWindows,
  AiFillChrome,
  AiFillFire,
  AiFillBulb,
  AiFillCloud,
  AiFillCrown,
  AiFillTrophy,
  AiFillRocket,
  AiFillThunderbolt,
  AiFillShop,
  AiFillCar,
  BiSolidPlanet,
  BiSolidMoon,
  BiSolidSun,
  BiSolidCoffee,
  BiSolidPizza,
  BiSolidTree,
  BiSolidDog,
  BiSolidCat,
  BsFillLightningChargeFill,
  BsFillMoonStarsFill,
  BsFillSunFill,
  BsFillCloudFill,
}

/**
 * Convert a React icon component to an SVG data URL
 */
export function iconToDataURL(iconName: string, color: string = '#000000', size: number = 512): string {
  const IconComponent = ICON_COMPONENTS[iconName]
  
  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found`)
    return ''
  }

  // Render the icon to SVG string
  const svgString = renderToStaticMarkup(
    React.createElement(IconComponent, {
      color,
      size,
    })
  )

  // Create a data URL from the SVG
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`
  return dataUrl
}

/**
 * Get icon component by name
 */
export function getIconComponent(iconName: string): IconType | undefined {
  return ICON_COMPONENTS[iconName]
}

