import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Form, Checkbox, Alert } from 'antd';
import PropTypes from 'prop-types';
import { USER_REGISTER } from '../../util/account'

const Register = ({ form: { getFieldDecorator, validateFields, getFieldValue } }) => {
    const initialRef = useRef(true);
    const dispatch = useDispatch();

    const handleRegister = (e) => {
        e.preventDefault();
        validateFields((err, fieldsValue) => {
            if (!err) {
                const {concent, ...values} = fieldsValue;
                if (!concent) {
                    initialRef.current = false;
                    return;
                }
                // dispatch({type: USER_REGISTER, payload: values})
            }
        })
    }

    return (
        <Form onSubmit={handleRegister}>
            <Form.Item>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入昵称' }],
                })(
                    <Input placeholder="请输入昵称" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('register_account', {
                    rules: [{ required: true, message: '请输入正确的手机号' }],
                })(
                    <Input placeholder="请输入注册手机号" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('register_password', {
                    rules: [{ required: true, message: '请输入密码' }],
                })(
                    <Input.Password placeholder="请输入密码" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('concent', {
                    valuePropName: 'checked',
                    initialValue: false,
                })(
                    <Checkbox onChange={() => initialRef.current = false}>同意<a>用户协议</a>和<a>隐私政策</a></Checkbox>
                )}
                {!initialRef.current && !getFieldValue('concent') &&
                    <Alert message="注册请同意协议" type="error" />
                }
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%', background: '#42c02e', borderColor: '#42c02e' }}
                >
                    注册
            </Button>
            </Form.Item>
        </Form>
    )
}

Register.propTypes = {
    form: PropTypes.object.isRequired,
}
const RegisterWithForm = Form.create({ name: 'create_new_account' })(Register);
export default RegisterWithForm;