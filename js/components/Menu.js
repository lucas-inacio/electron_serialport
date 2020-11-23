import React, { Component } from 'react';
import { 
    Button, 
    Collapse, 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownToggle,
    Input,
    InputGroup,
    InputGroupAddon,
    Nav, 
    Navbar, 
    NavbarBrand, 
    NavbarToggler, 
    NavItem 
} from 'reactstrap';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.startAcq = props.startAcq;
        this.stopAcq = props.stopAcq;
        this.addPlot = props.addPlot;
        this.clearPlot = props.clearPlot;
        this.state = {
            isOpen: false,
            dropDownOpen: false,
            baudOpen: false,
            typeOpen: false,
            type: null,
            quantity: null,
            portList: [],
            port: '',
            baud: null,
            running: false
        };

        this.baudRates = [
            110,
            150,
            300,
            1200,
            2400,
            4800,
            9600,
            19200,
            38400,
            57600,
            115200,
            230400,
            460800,
            921600
        ];
        setInterval(() => this.updatePortList(), 5000);
    }

    // Seleciona baudRate a partir do menu dropdown
    onBaud(e) {
        this.setState({baud: parseInt(e.target.innerText, 10)});
    }
    
    // Seleciona a porta a partir do menu dropdown
    onPort(e) {
        this.setState({port: e.target.innerText});
    }

    onRun() {
        this.setState(state => {
            if (state.running) {
                this.stopAcq();
                return {running: false};
            } else {
                return {running: this.startAcq(state.port, state.baud, state.type)};
            }
        });
    }

    onType(e) {
        this.setState({type: e.target.innerText});
    }

    onQuantity(e) {
        let quantity = Number(e.target.value);
        if (quantity) {
            this.setState({quantity});
            this.clearPlot();
            for (let i = 0; i < quantity; ++i) {
                this.addPlot();
            }
        }
    }

    updatePortList() {
        ListPorts().then(portsList => {
            let ports = [];
            for (let port of portsList)
                ports.push(port.path);
            this.setState({portList: ports});
        });
    }

    toggle() {
        this.setState((state) => ({
            isOpen: !state.isOpen
        }));
    }

    toggleDrop() {
        this.setState((state) => ({
            dropDownOpen: !state.dropDownOpen
        }));
    }

    toggleBaud() {
        this.setState((state) => ({
            baudOpen: !state.baudOpen
        }));
    }

    toggleType() {
        this.setState((state) => ({
            typeOpen: !state.typeOpen
        }));
    }

    render() {
        return (
            <Navbar color="faded" light expand="md" className="flex-md-column">
                <NavbarBrand className="mr-auto">
                    Menu
                </NavbarBrand>
                <NavbarToggler onClick={() => this.toggle()}/>
                <Collapse isOpen={this.state.isOpen} navbar className="w-100">
                    <Nav vertical navbar>
                        <NavItem className="my-2">
                            <Dropdown isOpen={this.state.dropDownOpen} toggle={() => this.toggleDrop()}>
                                <DropdownToggle block="md">{this.state.port || 'Porta'}</DropdownToggle>
                                <DropdownMenu>
                                    {this.state.portList.map((value) => (
                                        <DropdownItem onClick={(e) => this.onPort(e)} key={value}>{value}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem className="my-2">
                            <Dropdown isOpen={this.state.baudOpen} toggle={() => this.toggleBaud()}>
                                <DropdownToggle block="md">{this.state.baud || 'Baud'}</DropdownToggle>
                                <DropdownMenu>
                                    {this.baudRates.map((value) => (
                                        <DropdownItem onClick={(e) => this.onBaud(e)} key={value}>{value}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem className="my-2">
                            <InputGroup>
                                <Input  type="number" min="1" placeholder="quantidade de dados" onChange={(e) => this.onQuantity(e)}/>
                                <InputGroupAddon addonType="append">
                                    <Dropdown isOpen={this.state.typeOpen} toggle={() => this.toggleType()}>
                                        <DropdownToggle block="md">{this.state.type || 'Tipo de dados'}</DropdownToggle>
                                        <DropdownMenu>
                                            {Object.keys(DATA_TYPE_MAP).map(value => (
                                                <DropdownItem onClick={(e) => this.onType(e)} key={value}>{value}</DropdownItem>
                                                ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </InputGroupAddon>
                            </InputGroup>
                        </NavItem>
                        <NavItem className="my-2">
                            <Button block="md" color="primary" onClick={() => this.onRun()}>{(this.state.running) ? 'Parar' : 'Iniciar'}</Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default Menu;