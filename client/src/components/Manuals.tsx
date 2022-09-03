import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createManual, deleteManual, getManuals, patchManual } from '../api/manuals-api'
import Auth from '../auth/Auth'
import { Manual } from '../types/Manual'

interface ManualsProps {
  auth: Auth
  history: History
}

interface ManualsState {
  manuals: Manual[]
  newManualName: string
  loadingManuals: boolean
}

export class Manuals extends React.PureComponent<ManualsProps, ManualsState> {
  state: ManualsState = {
    manuals: [],
    newManualName: '',
    loadingManuals: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newManualName: event.target.value })
  }

  onEditButtonClick = (manualId: string) => {
    this.props.history.push(`/manuals/${manualId}/edit`)
  }

  onManualCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newManual = await createManual(this.props.auth.getIdToken(), {
        name: this.state.newManualName,
        dueDate
      })
      this.setState({
        manuals: [...this.state.manuals, newManual],
        newManualName: ''
      })
    } catch {
      alert('Manual creation failed')
    }
  }

  onManualDelete = async (manualId: string) => {
    try {
      await deleteManual(this.props.auth.getIdToken(), manualId)
      this.setState({
        manuals: this.state.manuals.filter(manual => manual.manualId !== manualId)
      })
    } catch {
      alert('Manual deletion failed')
    }
  }

  onManualCheck = async (pos: number) => {
    try {
      const manual = this.state.manuals[pos]
      await patchManual(this.props.auth.getIdToken(), manual.manualId, {
        name: manual.name,
        addDate: manual.addDate
      })
  /*     this.setState({
        manuals: update(this.state.manuals, {
          [pos]: { done: { $set: !manual.done } }
        })
      }) */
    } catch {
      alert('Manual deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const manuals = await getManuals(this.props.auth.getIdToken())
      this.setState({
        manuals,
        loadingManuals: false
      })
    } catch (e) {
      alert(`Failed to fetch manuals`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Manuals</Header>

        {this.renderCreateManualInput()}

        {this.renderManuals()}
      </div>
    )
  }

  renderCreateManualInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add new manual',
              onClick: this.onManualCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Dishwasher, dryer, etc..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderManuals() {
    if (this.state.loadingManuals) {
      return this.renderLoading()
    }

    return this.renderManualsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Manuals
        </Loader>
      </Grid.Row>
    )
  }

  renderManualsList() {
    return (
      <Grid padded>
        {this.state.manuals.map((manual, pos) => {
          return (
            <Grid.Row key={manual.manualId}>
              <Grid.Column width={1} verticalAlign="middle">
{/*                 <Checkbox
                  onChange={() => this.onManualCheck(pos)}
                  checked={manual.done}
                /> */}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {manual.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {manual.addDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(manual.manualId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onManualDelete(manual.manualId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {manual.attachmentUrl && (
                <Image src={manual.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
