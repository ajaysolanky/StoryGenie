def do_magic(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    MAX_MAX_LENGTH = 50
    DAILY_MAX_REQUESTS = 5000

    import os
    import requests
    from datetime import date

    fdate = date.today().strftime('%d%m%Y')

    firebase_url = "https://storygenie-default-rtdb.firebaseio.com/daily.json?auth=%s" % os.environ.get('FB_DB_SECRET', 'not the secret')

    fb_resp = requests.get(firebase_url + '&orderBy="$key"&equalTo="%s"' % fdate)
    # if fb_resp.status_code < 200 or fb_resp.status_code >= 300:
    #     raise Exception('FB request error')
    fb_json = fb_resp.json()
    query_count = fb_json.get(fdate, {}).get("global", 0)

    query_count += 1 #obvious race condition here but fuck it i guess
    print("query count: " + str(query_count))
    
    if query_count >= DAILY_MAX_REQUESTS:
        return 'max requests exceeded'

    put_status = requests.put(firebase_url, json={fdate: {"global": query_count}})

    if put_status.status_code != 200:
        raise Exception('FB put status: ' + str(put_status))

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
        data["max_length"] = min(MAX_MAX_LENGTH, data.get("max_length", 1))
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


# dreamily api
#data={'content': 'I am alone in this world, nobody', 'lang': 'en', 'storyline': False, 'title': 'nobody', 'uid': '61d218300a00ba211ae3d1b0', 'branchid': '61d218440a00ba211ae3d226', 'lastnode': '61d218440a00ba211ae3d225', 'mid': '60b84adf49b7d6091af5d433', 'nid': '61d218440a00ba211ae3d224', 'ostype': '', 'status': 'http'}

# headers={'Content-Type':'application/json;charset=UTF-8'}

# url = 'https://dreamily.ai/v2/novel/61d218300a00ba211ae3d1b0/novel_ai'