import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'

import DepositForm from './Deposit'
import WithdrawForm from './Withdraw'

const CustomTab = ({ children, ...otherProps }) => (
  <Tab className='tabs__tab' {...otherProps}>
    <h1>{children}</h1>
  </Tab>
);

CustomTab.tabsRole = 'Tab'

const CustomTabPanel = ({ children, myCustomProp, className, ...otherProps }) => (
  <TabPanel {...otherProps}>
    <div className={className}>{children}</div>
    {myCustomProp && `myCustomProp: ${myCustomProp}`}
  </TabPanel>
)

CustomTabPanel.tabsRole = 'TabPanel'


const CustomTabList = ({ children, ...otherProps }) => (
  <TabList {...otherProps}>
    {children}
  </TabList>
)

CustomTabList.tabsRole = 'TabList'

const TabsWrapper = () => {
  return (
    <Tabs className='tabs' selectedTabClassName='tabs__tab--selected'>
      <CustomTabList className='tabs__list'>
        <CustomTab>Deposit</CustomTab>
        <CustomTab>Withdraw</CustomTab>
        {/* <CustomTab>Stats</CustomTab> */}
      </CustomTabList>
      <CustomTabPanel className='tabs__panel'><DepositForm /></CustomTabPanel>
      <CustomTabPanel className='tabs__panel'><WithdrawForm /></CustomTabPanel>
      {/* <CustomTabPanel className='tabs__panel'>Panel 3</CustomTabPanel> */}
    </Tabs>
  )
}

export default TabsWrapper