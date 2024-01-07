import { Fragment, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import ExecutorForm from './ExecutorForm';

const ModalExecutor = (props) => {
    const [visible, setVisible] = useState(false)
    var button = <Button onClick={() => toggle()}>Редактировать</Button>;

    const toggle = () => {
        setVisible(!visible)
    }

    if (props.create) {
        button = (
            <Button
                color="primary"
                className="float-right"
                onClick={() => toggle()}
                style={{minWidth: '200px'}}>
                Добавить испольнителя    
            </Button>
        )
    }

    return (
        <Fragment>
            {button}
            <Modal isOpen={visible} toggle={toggle}>
                <ModalHeader
                    style={{justifyContent: 'center'}}>{props.create ? 'Добавить испольнителя': 'Редактировать испольнителя'}</ModalHeader>
                <ModalBody>
                    <ExecutorForm
                        executor={props.executor ? props.executor : []}
                        resetState={props.resetState}
                        toggle={toggle}
                        newExecutor={props.newExecutor}
                    />
                </ModalBody>
            </Modal>
        </Fragment>
    );
}

export default ModalExecutor;