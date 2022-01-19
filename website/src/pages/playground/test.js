import Page from 'components/Page'
import React, { useState } from 'react'
import styled from 'styled-components'
import utils from 'utils/baseScope'

const Container = styled(Page).attrs({ full: true })`
  max-width: 100%;
  height: 100vh;
`

const columns = utils.generateColumns(10, 'column-', {
  width: 500,
  resizable: true,
})
const data = utils.generateData(columns, 200)
const Table = utils.Table

const ITEM_DATA = { a: 1 }

const Test = ({ location }) => {
  const [itemData, setItemData] = useState(ITEM_DATA)

  return (
    <Container title="Playground" location={location}>
      <button onClick={() => setItemData({ a: itemData.a + 1 })}>State</button>
      <Table
        fixed
        columns={columns}
        data={data}
        virtualized={false}
        itemData={ITEM_DATA}
      />
    </Container>
  )
}

export default Test
