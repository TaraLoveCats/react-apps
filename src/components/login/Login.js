import React from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { USER_LOGIN } from '../../util/account'

const Login = ({ form: { getFieldDecorator, validateFields } }) => {
    const dispatch = useDispatch();
    const handleLogin = (e) => {
        e.preventDefault();
        validateFields((err, fieldsValue) => {
            if (!err) {
                // dispatch({type: USER_LOGIN, payload: fieldsValue})
            }
        })
    }
    return (
        <Form onSubmit={handleLogin}>
            <Form.Item>
                {getFieldDecorator('login_account', {
                    rules: [{ required: true, message: '请输入正确的手机号或邮箱' }],
                })(
                    <Input placeholder="请输入手机号或邮箱" />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('login_password', {
                    rules: [{ required: true, message: '请输入密码' }],
                })(
                    <Input.Password placeholder="请输入密码" />
                )}
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                >
                    登录
            </Button>
            </Form.Item>
        </Form>
    )
}

Login.propTypes = {
    form: PropTypes.object.isRequired,
}
const LoginWithForm = Form.create({ name: 'create_new_account' })(Login);
export default LoginWithForm;