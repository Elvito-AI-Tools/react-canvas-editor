"use client"

import React, { useState, useMemo } from 'react'
import { useEditor } from '@/contexts/EditorContext'
import { Search } from 'lucide-react'
import { 
  FaHeart, FaStar, FaHome, FaUser, FaCog, FaEnvelope, FaPhone, FaCamera,
  FaMusic, FaVideo, FaFile, FaFolder, FaTrash, FaEdit, FaSave, FaDownload,
  FaUpload, FaSearch, FaBell, FaCalendar, FaClock, FaMapMarkerAlt, FaGlobe,
  FaShoppingCart, FaCreditCard, FaGift, FaTag, FaBookmark, FaLock, FaUnlock,
  FaEye, FaEyeSlash, FaThumbsUp, FaThumbsDown, FaComment, FaShare, FaLink,
  FaPaperclip, FaImage, FaPlay, FaPause, FaStop, FaForward, FaBackward,
} from 'react-icons/fa'
import { 
  AiFillApple, AiFillAndroid, AiFillWindows, AiFillChrome, AiFillFire,
  AiFillBulb, AiFillCloud, AiFillCrown, AiFillTrophy, AiFillRocket,
  AiFillThunderbolt, AiFillShop, AiFillCar, AiFillHome as AiHome,
} from 'react-icons/ai'
import { 
  BiSolidPlanet, BiSolidMoon, BiSolidSun, BiSolidCoffee, BiSolidPizza,
  BiSolidTree, BiSolidDog, BiSolidCat, BiSolidHeart as BiHeart,
} from 'react-icons/bi'
import {
  BsFillLightningChargeFill, BsFillSuitHeartFill, BsFillStarFill,
  BsFillMoonStarsFill, BsFillSunFill, BsFillCloudFill,
} from 'react-icons/bs'
import { IconType } from 'react-icons'

interface IconItem {
  name: string
  Icon: IconType
  category: string
  keywords: string[]
}

// Comprehensive icon list
const ICON_LIST: IconItem[] = [
  // Common Icons
  { name: 'Heart', Icon: FaHeart, category: 'common', keywords: ['heart', 'love', 'like', 'favorite'] },
  { name: 'Star', Icon: FaStar, category: 'common', keywords: ['star', 'favorite', 'rating'] },
  { name: 'Home', Icon: FaHome, category: 'common', keywords: ['home', 'house', 'main'] },
  { name: 'User', Icon: FaUser, category: 'common', keywords: ['user', 'person', 'profile', 'account'] },
  { name: 'Settings', Icon: FaCog, category: 'common', keywords: ['settings', 'gear', 'config', 'cog'] },
  { name: 'Mail', Icon: FaEnvelope, category: 'common', keywords: ['mail', 'email', 'envelope', 'message'] },
  { name: 'Phone', Icon: FaPhone, category: 'common', keywords: ['phone', 'call', 'telephone'] },
  { name: 'Camera', Icon: FaCamera, category: 'common', keywords: ['camera', 'photo', 'picture'] },
  
  // Media
  { name: 'Music', Icon: FaMusic, category: 'media', keywords: ['music', 'audio', 'sound', 'song'] },
  { name: 'Video', Icon: FaVideo, category: 'media', keywords: ['video', 'film', 'movie'] },
  { name: 'Image', Icon: FaImage, category: 'media', keywords: ['image', 'photo', 'picture'] },
  { name: 'Play', Icon: FaPlay, category: 'media', keywords: ['play', 'start'] },
  { name: 'Pause', Icon: FaPause, category: 'media', keywords: ['pause', 'stop'] },
  { name: 'Stop', Icon: FaStop, category: 'media', keywords: ['stop', 'end'] },
  { name: 'Forward', Icon: FaForward, category: 'media', keywords: ['forward', 'next', 'skip'] },
  { name: 'Backward', Icon: FaBackward, category: 'media', keywords: ['backward', 'previous', 'back'] },
  
  // Files
  { name: 'File', Icon: FaFile, category: 'files', keywords: ['file', 'document'] },
  { name: 'Folder', Icon: FaFolder, category: 'files', keywords: ['folder', 'directory'] },
  { name: 'Trash', Icon: FaTrash, category: 'files', keywords: ['trash', 'delete', 'remove', 'bin'] },
  { name: 'Edit', Icon: FaEdit, category: 'files', keywords: ['edit', 'pencil', 'write'] },
  { name: 'Save', Icon: FaSave, category: 'files', keywords: ['save', 'disk'] },
  { name: 'Download', Icon: FaDownload, category: 'files', keywords: ['download', 'save'] },
  { name: 'Upload', Icon: FaUpload, category: 'files', keywords: ['upload', 'import'] },
  
  // UI Elements
  { name: 'Search', Icon: FaSearch, category: 'ui', keywords: ['search', 'find', 'magnify'] },
  { name: 'Bell', Icon: FaBell, category: 'ui', keywords: ['bell', 'notification', 'alert'] },
  { name: 'Calendar', Icon: FaCalendar, category: 'ui', keywords: ['calendar', 'date', 'schedule'] },
  { name: 'Clock', Icon: FaClock, category: 'ui', keywords: ['clock', 'time'] },
  { name: 'Location', Icon: FaMapMarkerAlt, category: 'ui', keywords: ['location', 'map', 'marker', 'pin', 'place'] },
  { name: 'Globe', Icon: FaGlobe, category: 'ui', keywords: ['globe', 'world', 'earth', 'internet'] },
  { name: 'Bookmark', Icon: FaBookmark, category: 'ui', keywords: ['bookmark', 'save', 'favorite'] },
  { name: 'Lock', Icon: FaLock, category: 'ui', keywords: ['lock', 'secure', 'private'] },
  { name: 'Unlock', Icon: FaUnlock, category: 'ui', keywords: ['unlock', 'open'] },
  { name: 'Eye', Icon: FaEye, category: 'ui', keywords: ['eye', 'view', 'show', 'visible'] },
  { name: 'Eye Slash', Icon: FaEyeSlash, category: 'ui', keywords: ['eye', 'hide', 'hidden', 'invisible'] },
  
  // Shopping
  { name: 'Shopping Cart', Icon: FaShoppingCart, category: 'shopping', keywords: ['cart', 'shopping', 'buy', 'basket'] },
  { name: 'Credit Card', Icon: FaCreditCard, category: 'shopping', keywords: ['card', 'credit', 'payment'] },
  { name: 'Gift', Icon: FaGift, category: 'shopping', keywords: ['gift', 'present'] },
  { name: 'Tag', Icon: FaTag, category: 'shopping', keywords: ['tag', 'price', 'label'] },
  
  // Social
  { name: 'Thumbs Up', Icon: FaThumbsUp, category: 'social', keywords: ['like', 'thumbs', 'up', 'good'] },
  { name: 'Thumbs Down', Icon: FaThumbsDown, category: 'social', keywords: ['dislike', 'thumbs', 'down', 'bad'] },
  { name: 'Comment', Icon: FaComment, category: 'social', keywords: ['comment', 'chat', 'message', 'talk'] },
  { name: 'Share', Icon: FaShare, category: 'social', keywords: ['share', 'send'] },
  { name: 'Link', Icon: FaLink, category: 'social', keywords: ['link', 'url', 'chain'] },
  { name: 'Paperclip', Icon: FaPaperclip, category: 'social', keywords: ['attach', 'clip', 'file'] },
  
  // Brand/Tech
  { name: 'Apple', Icon: AiFillApple, category: 'brand', keywords: ['apple', 'mac', 'ios'] },
  { name: 'Android', Icon: AiFillAndroid, category: 'brand', keywords: ['android', 'robot'] },
  { name: 'Windows', Icon: AiFillWindows, category: 'brand', keywords: ['windows', 'microsoft'] },
  { name: 'Chrome', Icon: AiFillChrome, category: 'brand', keywords: ['chrome', 'browser'] },
  
  // Abstract
  { name: 'Fire', Icon: AiFillFire, category: 'abstract', keywords: ['fire', 'hot', 'flame'] },
  { name: 'Bulb', Icon: AiFillBulb, category: 'abstract', keywords: ['bulb', 'idea', 'light'] },
  { name: 'Cloud', Icon: AiFillCloud, category: 'abstract', keywords: ['cloud', 'storage', 'weather'] },
  { name: 'Crown', Icon: AiFillCrown, category: 'abstract', keywords: ['crown', 'king', 'premium'] },
  { name: 'Trophy', Icon: AiFillTrophy, category: 'abstract', keywords: ['trophy', 'award', 'win', 'prize'] },
  { name: 'Rocket', Icon: AiFillRocket, category: 'abstract', keywords: ['rocket', 'launch', 'space', 'fast'] },
  { name: 'Thunder', Icon: AiFillThunderbolt, category: 'abstract', keywords: ['thunder', 'bolt', 'lightning', 'fast', 'power'] },
  { name: 'Lightning', Icon: BsFillLightningChargeFill, category: 'abstract', keywords: ['lightning', 'bolt', 'power', 'fast'] },
  
  // Shop & Transport
  { name: 'Shop', Icon: AiFillShop, category: 'places', keywords: ['shop', 'store', 'market'] },
  { name: 'Car', Icon: AiFillCar, category: 'transport', keywords: ['car', 'vehicle', 'auto'] },
  
  // Nature
  { name: 'Planet', Icon: BiSolidPlanet, category: 'nature', keywords: ['planet', 'space', 'earth', 'world'] },
  { name: 'Moon', Icon: BiSolidMoon, category: 'nature', keywords: ['moon', 'night', 'dark'] },
  { name: 'Sun', Icon: BiSolidSun, category: 'nature', keywords: ['sun', 'day', 'light', 'bright'] },
  { name: 'Tree', Icon: BiSolidTree, category: 'nature', keywords: ['tree', 'plant', 'nature'] },
  { name: 'Moon Stars', Icon: BsFillMoonStarsFill, category: 'nature', keywords: ['moon', 'stars', 'night'] },
  { name: 'Sun Fill', Icon: BsFillSunFill, category: 'nature', keywords: ['sun', 'day', 'bright'] },
  { name: 'Cloud Fill', Icon: BsFillCloudFill, category: 'nature', keywords: ['cloud', 'weather'] },
  
  // Food & Drink
  { name: 'Coffee', Icon: BiSolidCoffee, category: 'food', keywords: ['coffee', 'drink', 'cafe'] },
  { name: 'Pizza', Icon: BiSolidPizza, category: 'food', keywords: ['pizza', 'food'] },
  
  // Animals
  { name: 'Dog', Icon: BiSolidDog, category: 'animals', keywords: ['dog', 'pet', 'animal'] },
  { name: 'Cat', Icon: BiSolidCat, category: 'animals', keywords: ['cat', 'pet', 'animal'] },
]

export const IconLeftSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { addElement, setSelectedIds } = useEditor()

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ICON_LIST
    }
    
    const query = searchQuery.toLowerCase()
    return ICON_LIST.filter(icon => 
      icon.name.toLowerCase().includes(query) ||
      icon.category.toLowerCase().includes(query) ||
      icon.keywords.some(keyword => keyword.includes(query))
    )
  }, [searchQuery])

  const handleIconClick = (iconName: string, IconComponent: IconType) => {
    // Add icon element to canvas
    const elementId = addElement('icon', {
      iconName,
      iconComponent: IconComponent.name,
      size: 80,
      color: '#000000',
      x: 100,
      y: 100,
    })
    
    setSelectedIds([elementId])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons..."
              className="w-full pl-10 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredIcons.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filteredIcons.map((iconItem) => (
                <button
                  key={iconItem.name}
                  onClick={() => handleIconClick(iconItem.name, iconItem.Icon)}
                  className="aspect-square flex items-center justify-center rounded-lg border border-border hover:border-primary bg-background hover:bg-accent transition-all hover:scale-105 group p-3"
                  title={iconItem.name}
                >
                  <iconItem.Icon className="w-full h-full text-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <Search className="w-12 h-12 mb-3 opacity-50" />
    <p className="text-sm font-medium">No icons found</p>
    <p className="text-xs mt-1">Try a different search term</p>
  </div>
)

