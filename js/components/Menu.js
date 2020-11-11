import React, { Component } from 'react';
import { 
    Button, 
    Collapse, 
    Dropdown, 
    DropdownItem, 
    DropdownMenu, 
    DropdownToggle, 
    Nav, 
    Navbar, 
    NavbarBrand, 
    NavbarToggler, 
    NavItem 
} from 'reactstrap';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dropDownOpen: false,
            portList: []
        };

        setInterval(() => this.updatePortList(), 5000);
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

    render() {
        return (
            <Navbar color="faded" light expand="md" className="flex-md-column">
                <NavbarBrand className="mr-auto">
                    Menu
                </NavbarBrand>
                <NavbarToggler onClick={() => this.toggle()}/>
                <Collapse isOpen={this.state.isOpen} navbar className="w-100">
                    <Nav vertical navbar>
                        <NavItem>
                            <Dropdown isOpen={this.state.dropDownOpen} toggle={() => this.toggleDrop()}>
                                <DropdownToggle>Porta</DropdownToggle>
                                <DropdownMenu>
                                    {this.state.portList.map((value) => (
                                        <DropdownItem>{value}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </NavItem>
                        <NavItem>
                            <Button>Opção 2</Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default Menu;