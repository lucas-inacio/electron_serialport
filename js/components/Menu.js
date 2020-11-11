import React, { Component } from 'react';
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState((state) => ({
            isOpen: !state.isOpen
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
                            <Button>Opção 1</Button>
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