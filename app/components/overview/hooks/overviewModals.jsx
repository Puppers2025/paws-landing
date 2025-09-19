// components/overview/hooks/overviewModals.jsx
'use client'

import { createContext, useContext, useState } from 'react'
import ShopModal from '@/components/overview/ShopModal'
import EnergyModal from '@/components/overview/EnergyModal'
import StakingModal from '@/components/overview/StakingModal'
import DnaModal from '@/components/overview/DnaModal'
import MissionModal from '@/components/overview/MissionModal'

const OverviewModalsContext = createContext()

export function OverviewModalsProvider({ children }) {
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isEnergyOpen, setIsEnergyOpen] = useState(false)
  const [isStakingOpen, setIsStakingOpen] = useState(false)
  const [isDnaOpen, setIsDnaOpen] = useState(false)
  const [isMissionOpen, setIsMissionOpen] = useState(false)

  const value = {
    openShop: () => setIsShopOpen(true),
    openEnergy: () => setIsEnergyOpen(true),
    openStaking: () => setIsStakingOpen(true),
    openDna: () => setIsDnaOpen(true),
    openMission: () => setIsMissionOpen(true),

    shopModal: isShopOpen ? <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} /> : null,
    energyModal: isEnergyOpen ? <EnergyModal isOpen={isEnergyOpen} onClose={() => setIsEnergyOpen(false)} /> : null,
    stakingModal: isStakingOpen ? <StakingModal isOpen={isStakingOpen} onClose={() => setIsStakingOpen(false)} /> : null,
    dnaModal: isDnaOpen ? <DnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} /> : null,
    missionModal: isMissionOpen ? <MissionModal isOpen={isMissionOpen} onClose={() => setIsMissionOpen(false)} /> : null,
  }

  return (
    <OverviewModalsContext.Provider value={value}>
      {children}
    </OverviewModalsContext.Provider>
  )
}

export function useOverviewModals() {
  return useContext(OverviewModalsContext)
}