def initiative_sort(init_order):
    """sorts all the characters for a given combat by initiative"""

    print("passed into sort function: ", init_order)
    for i in range(len(init_order)):
        check = init_order[i]
        print("the check is: ", check, " and i is: ", i)
        index = i
        while index > 0 and init_order[index - 1][0] < check[0]:
            init_order[index] = init_order[index - 1]
            index = index - 1
        init_order[index] = check
    print("we will return init order as: ", init_order)

    return init_order
