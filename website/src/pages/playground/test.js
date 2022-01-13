import Page from 'components/Page'
import React from 'react'
import styled from 'styled-components'
import utils from 'utils/baseScope'

const Container = styled(Page).attrs({ full: true })`
  max-width: 100%;
  height: 100vh;
`

const columns = utils.generateColumns(10, 'column-', { width: 500 })
const data = utils.generateData(columns, 200)
const Table = utils.Table

export default ({ location }) => (
  <Container title="Playground" location={location}>
    <Table fixed columns={columns} data={data} />
  </Container>
)
