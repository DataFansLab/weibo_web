<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: ruby
 * Date: 2015/6/12
 * Time: 14:57
 */

class Weibo extends CI_Controller {
    public function index()
    {
        $this->load->view('weibo');
    }
}