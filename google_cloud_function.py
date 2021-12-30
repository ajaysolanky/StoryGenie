def do_magic(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    max_max_length = 50

    import os
    import requests
    nc_base_url = "https://api.nlpcloud.io/v1%s/gpt-j/generation"

    headers = {"Content-Type": "application/json", "Authorization": "Token %s" % os.environ.get('NC_TK', 'not the token')}

    request_json = request.get_json()
    
    if request_json:
        # return f'hmm'
        use_gpu = request_json.get('gpu', False)
        to_url = nc_base_url % ('/gpu' if use_gpu else '')
        valid_keys = ["min_length", "max_length", "length_no_input",
                        "remove_input", "repetition_penalty", "temperature",
                        "top_p", "text"]
        data = {k:v for (k,v) in request_json.items() if (k in valid_keys)}
        data["max_length"] = min(max_max_length, data.get("max_length", 1))
        response = requests.post(to_url, headers=headers, json=data)
        print(to_url)
        print(response.status_code)
        if response.status_code < 200 or response.status_code >= 300:
            raise Exception('NC request error')
        print('data=' + str(data))
        print('response=' + response.text)
        return response.text
    else:
        return f"no args?! tf"
