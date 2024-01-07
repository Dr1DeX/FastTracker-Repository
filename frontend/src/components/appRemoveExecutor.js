import { Fragment, useState } from "react";
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap'
import axios from "axios";
import { API_URL } from "../index";


const AppRemoveExecutor = (props) => {
    const [visible, setVisible] = useState(false)
    const toggle = () => {
        setVisible(!visible)
    }

    const deleteExecutor = () => {
        axios.delete(API_URL + '/executors/' + props.pk).then(() => {
            props.resetState()
            toggle();
        });
    }

    return (
        <Fragment>
            <Button color="danger" onClick={() => toggle()}>
                Удалить испольнителя
            </Button>
            <Modal isOpen={visible} toggle={toggle} style={{width: '300px'}}>
                <ModalHeader style={{justifyContent: 'center'}}>Подтверждение</ModalHeader>
                <ModalFooter style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button
                        type="button"
                        onClick={() => deleteExecutor()}
                        color="primary"
                    >Удалить</Button>
                    <Button type="button" onClick={() => toggle()}>Отмена</Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
}

export default AppRemoveExecutor;